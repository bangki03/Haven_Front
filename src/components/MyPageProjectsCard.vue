<template>
    <div id="preview" style="height: 100%; width: 100%;">
        <div id="preview-header" style="">
            <div id="preview-header-top">
                <div style="display:inline-flex; flex-direction: row;">
                    <img
                    id="Project_Preview_Icon"
                    src="../assets/Project_Preview_Icon.png"
                    alt="../assets/Project_Preview_Icon.png"
                    style="height: 25px; width: 25px; padding: 0; margin-right:auto;"
                    />
                    <div style="margin: 0;"> {{ project_SummaryCard.project_type }}</div>
                </div>

                <div>
                    사양결정
                </div>
                <div>
                    사양결정
                </div>
            </div>

            <div id="preview-header-middle">{{ project_SummaryCard.project_name }}</div>
            <div id="preview-header-bottom">
                <div>
                    {{ project_SummaryCard.factory_name }}
                </div>
            </div>
            
        </div>
        <div class="row" style="height: 5%; width:100%; "></div>
        <div id="preview-footer" style="height: 35%; width:100%; margin:0;">
            <p style="margin: 0 10% 1em 0; text-align: left; font-size: 1em;"> {{ project_SummaryCard.project_name }}</p>
            <p style="margin: 0 10% 1em 0; text-align: left; font-size: 0.66em;"> {{ project_SummaryCard.project_script }}</p>
        </div>



        <!-- <div id="preview-header" style="height: 60%; width:100%; margin:0; border-radius: 0.5em;">
            <div style="display:inline-flex; flex-direction: row;">
                <img
                id="Project_Preview_Icon"
                src="../assets/Project_Preview_Icon.png"
                alt="../assets/Project_Preview_Icon.png"
                style="height: 25px; width: 25px; padding: 0; margin-right:auto;"
                />
                <div style="margin: 0;"> {{ project_SummaryCard.project_type }}</div>
            </div>

            <div>
                사양결정
            </div>
            <div>
                사양결정
            </div>



            <p style="margin: 0;"> [project_type] : {{ project_SummaryCard.project_type }}</p>


            <p style="margin: 0;"> [project_name] : {{ project_SummaryCard.project_name }}</p>

            <p style="margin: 0;"> [factory_name] : {{ project_SummaryCard.factory_name }}</p>
            <p style="margin: 0;"> [product_name] : {{ project_SummaryCard.product_name }}</p>
            <p style="margin: 0;"> [process_name] : {{ project_SummaryCard.process_name }}</p>
        </div>
        <div class="row" style="height: 5%; width:100%; "></div>
        <div class="row" style="height: 35%; width:100%; margin:0; border: 1px solid black;">
            <p style="margin: 0; text-align: left;"> [project_name] : {{ project_SummaryCard.project_name }}</p>
            <p style="margin: 0; text-align: left;"> {{ project_SummaryCard.project_script }}</p>
        </div> -->

    </div>
</template>

<script>

export default{
    props: ['project_SummaryCard']
}
</script>

<style>
#preview-header {
    display:flex; 
    flex-direction: column; 
    justify-content: space-between;  
    
    height: 60%; 
    width:100%; 
    margin:0; 
    padding: 0.75em 0.5em 0.5em 0.5em; 
    
    border-radius: 0.5em;

    background: linear-gradient( to bottom, #151928, #313760);
    color: white
}

#preview-header-top {
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    font-size: 1em;
}

#preview-header-middle {
    font-size: 1.5em;
}
#preview-header-bottom {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 1em;
}


</style>